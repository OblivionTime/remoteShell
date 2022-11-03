/*
 * @Description:
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-11-03 13:33:58
 * @LastEditors: solid
 * @LastEditTime: 2022-11-03 13:44:52
 */
package main

import (
	"fmt"
	"os"
	"os/exec"
	"syscall"
)

func main() {

	if len(os.Args) <= 1 {
		return
	}
	cmdExec := os.Args[1]
	cmd := exec.Command("cmd", "/C", cmdExec)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	_, err := cmd.Output()
	cmd.Run()
	if err != nil {
		fmt.Println(err)
		return
	}
	cmd.Wait()
}
