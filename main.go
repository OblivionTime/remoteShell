/*
 * @Description:
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-08-24 18:37:22
 * @LastEditors: solid
 * @LastEditTime: 2022-11-03 13:57:04
 */
package main

import (
	"fmt"
	"image/png"
	"os"

	"github.com/kbinani/screenshot"
)
import "C"

//export GetFullScreen
func GetFullScreen(fp *C.char) {
	filePath := C.GoString(fp)
	bounds := screenshot.GetDisplayBounds(0)
	img, err := screenshot.CaptureRect(bounds)
	if err != nil {
		fmt.Println(err)

		return
	}
	file, err := os.Create(filePath)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer file.Close()
	png.Encode(file, img)
}
func main() {
}
