/*
 * @Description:
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-08-24 18:37:22
 * @LastEditors: solid
 * @LastEditTime: 2022-11-03 14:26:55
 */
package main

import (
	"fmt"
	"log"
	"os"
	"screen/navtive"
	"time"
)

var StartPath string
var ExePath string

func execUser() {
	var pro *os.Process
RECOVERY:
	for {
		// 需要session0穿透的
		if pid, err := navtive.StartProcessAsCurrentUser(StartPath, fmt.Sprintf("%s %s", StartPath, ExePath), ""); err != nil {
			log.Println("ERROR: ", err)
		} else {
			pro, err = os.FindProcess(int(pid))
			if err != nil {
				time.Sleep(time.Second * 2)
				continue
			}
			break
		}

	}
	p, _ := pro.Wait()
	if !p.Success() {
		time.Sleep(time.Second * 5)
		goto RECOVERY
	}
	goto RECOVERY
}
func main() {
	/*
	   初始化数据
	*/
	StartPath = os.Args[1]
	ExePath = os.Args[2]
	execUser()
}
