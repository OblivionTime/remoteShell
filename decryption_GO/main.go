/*
 * @Description:
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-08-24 18:37:22
 * @LastEditors: solid
 * @LastEditTime: 2022-11-11 17:21:29
 */
package main

import (
	"encoding/base64"
	"fmt"
	"os"
	"syscall"
	"test/decrypter"
	"unsafe"

	"github.com/jinzhu/gorm"

	jsoniter "github.com/json-iterator/go"
	_ "github.com/mattn/go-sqlite3"
	"github.com/tidwall/gjson"
)

//读取文件
func ReadFile(filename string) (string, error) {
	s, err := os.ReadFile(filename)
	return string(s), err
}

// 判断所给路径文件/文件夹是否存在
func filexists(path string) bool {
	_, err := os.Stat(path) //os.Stat获取文件信息
	if err != nil {
		return os.IsExist(err)
	}
	return true
}

//复制文件
func CopyFile(src, dst string) error {
	s, err := os.ReadFile(src)
	if err != nil {
		return err
	}
	err = os.WriteFile(dst, s, 0o600)
	if err != nil {
		return err
	}
	return nil
}
func SaveJson(data interface{}, filename string) error {
	writer, err := os.OpenFile(filename, os.O_TRUNC|os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0o600)
	if err != nil {
		fmt.Println(err)
	}
	encoder := jsoniter.NewEncoder(writer)
	encoder.SetIndent("  ", "  ")
	encoder.SetEscapeHTML(false)
	return encoder.Encode(data)
}

type dataBlob struct {
	cbData uint32
	pbData *byte
}

func NewBlob(d []byte) *dataBlob {
	if len(d) == 0 {
		return &dataBlob{}
	}
	return &dataBlob{
		pbData: &d[0],
		cbData: uint32(len(d)),
	}
}

//转字节数组
func (b *dataBlob) ToByteArray() []byte {
	d := make([]byte, b.cbData)
	copy(d, (*[1 << 30]byte)(unsafe.Pointer(b.pbData))[:])
	return d
}

//将目标文件复制到本地
func CopyItemToLocal(path, filename string) error {
	var err error
	err = CopyFile(path, filename)
	if err != nil {
		return err
	}
	return nil
}
func DPAPI(data []byte) ([]byte, error) {
	dllCrypt := syscall.NewLazyDLL("Crypt32.dll")
	dllKernel := syscall.NewLazyDLL("Kernel32.dll")
	procDecryptData := dllCrypt.NewProc("CryptUnprotectData")
	procLocalFree := dllKernel.NewProc("LocalFree")
	var outBlob dataBlob
	r, _, err := procDecryptData.Call(uintptr(unsafe.Pointer(NewBlob(data))), 0, 0, 0, 0, 0, uintptr(unsafe.Pointer(&outBlob)))
	if r == 0 {
		return nil, err
	}
	defer procLocalFree.Call(uintptr(unsafe.Pointer(outBlob.pbData)))
	return outBlob.ToByteArray(), nil
}
func GetMasterKey() []byte {
	keyFile, err := ReadFile("chromiumKey")
	if err != nil {
		return nil
	}
	// defer os.Remove(keyFile)
	encryptedKey := gjson.Get(keyFile, "os_crypt.encrypted_key")
	if !encryptedKey.Exists() {
		return nil
	}
	pureKey, err := base64.StdEncoding.DecodeString(encryptedKey.String())
	if err != nil {
		return nil
	}
	masterKey, err := decrypter.DPAPI(pureKey[5:])
	return masterKey
}

type cookie struct {
	Host         string `json:"domain" gorm:"column:host_key"`
	Path         string `json:"path"  gorm:"column:path"`
	KeyName      string `json:"name"  gorm:"column:name"`
	EncryptValue []byte `json:"encrypted_value"  gorm:"column:encrypted_value"`
	Value        string `json:"value"  gorm:"column:value"`
	IsSecure     bool   `json:"secure"  gorm:"column:is_secure"`
	IsHTTPOnly   bool   `json:"httpOnly"  gorm:"column:is_httponly"`
	HasExpire    bool   `json:"HasExpire"  gorm:"column:has_expires"`
	IsPersistent bool   `json:"persistent"  gorm:"column:is_persistent"`
}
type loginData struct {
	UserName    string `json:"username"  gorm:"column:username_value"`
	EncryptPass []byte `json:"password_value"  gorm:"column:password_value"`
	EncryptUser []byte
	Password    string `json:"password"  `
	LoginURL    string `json:"url"  gorm:"column:origin_url"`
}

func IntToBool(s int) bool {
	return s == 1
}

const (
	queryChromiumCookie = `SELECT name, encrypted_value, host_key, path, creation_utc, expires_utc, is_secure, is_httponly, has_expires, is_persistent FROM cookies`
	queryChromiumLogin  = `SELECT origin_url, username_value, password_value FROM logins`
)

func Parse(masterKey []byte, items interface{}, filename string) {
	DB, err := gorm.Open("sqlite3", filename)
	if err != nil {
		fmt.Printf("err=>%v\n", err)
		panic(err)
	}
	switch filename {
	case "cookie":
		DB.Raw(queryChromiumCookie).Scan(items)
		break
	case "password":
		DB.Raw(queryChromiumLogin).Scan(items)
		break
	}
}

func main() {
	path := os.Args[1]
	filename := os.Args[2]
	masterKey := GetMasterKey()
	CopyItemToLocal(path, filename)
	var data interface{}
	switch filename {
	case "cookie":
		var items []cookie
		Parse(masterKey, &items, filename)
		for index, item := range items {
			var password []byte
			if len(item.EncryptValue) > 0 {
				var err error
				if masterKey == nil {
					password, err = decrypter.DPAPI(item.EncryptValue)
				} else {
					password, err = decrypter.Chromium(masterKey, item.EncryptValue)
				}
				if err != nil {
					panic(err)
				}
			}
			items[index].Value = string(password)
		}
		data = items
		break
	case "password":
		var items []loginData
		Parse(masterKey, &items, filename)
		for index, item := range items {
			var password []byte
			if len(item.EncryptPass) > 0 {
				var err error
				if masterKey == nil {
					password, err = decrypter.DPAPI(item.EncryptPass)
				} else {
					password, err = decrypter.Chromium(masterKey, item.EncryptPass)
				}
				if err != nil {
					panic(err)
				}
			}
			items[index].Password = string(password)
		}
		data = items
		break
	}
	if !filexists("./result") {
		os.MkdirAll("./result", 777)
	}
	SaveJson(data, "result/"+filename+".json")
}
