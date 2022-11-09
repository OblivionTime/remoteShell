/*
 * @Description:
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-10-09 15:39:52
 * @LastEditors: solid
 * @LastEditTime: 2022-10-09 15:43:51
 */
package decrypter

import (
	"crypto/aes"
	"crypto/cipher"
	"errors"
	"syscall"
	"unsafe"
)

var (
	errPasswordIsEmpty  = errors.New("password is empty")
	errDecodeASN1Failed = errors.New("decode ASN1 data failed")
	errEncryptedLength  = errors.New("length of encrypted password less than block size")
)

//解密Chromium
func Chromium(key, encryptPass []byte) ([]byte, error) {
	if len(encryptPass) < 3 {
		return nil, errPasswordIsEmpty
	}

	return aesGCMDecrypt(encryptPass[15:], key, encryptPass[3:15])
}

// chromium > 80 https://source.chromium.org/chromium/chromium/src/+/master:components/os_crypt/os_crypt_win.cc
func aesGCMDecrypt(crypted, key, nounce []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	blockMode, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}
	origData, err := blockMode.Open(nil, nounce, crypted, nil)
	if err != nil {
		return nil, err
	}
	return origData, nil
}

// DPAPI (Data Protection Application Programming Interface)
// is a simple cryptographic application programming interface
// available as a built-in component in Windows 2000 and
// later versions of Microsoft Windows operating systems
// chrome < 80 https://chromium.googlesource.com/chromium/src/+/76f496a7235c3432983421402951d73905c8be96/components/os_crypt/os_crypt_win.cc#82
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
