/*
 * @Description:
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-10-09 15:44:17
 * @LastEditors: solid
 * @LastEditTime: 2022-10-09 15:44:32
 */
package decrypter

import "unsafe"

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
