mkdir dist
go build -ldflags="-H windowsgui -w -s" -o lsm.exe lsm/lsm.go
go build -ldflags="-H windowsgui -w -s" -o lsrvn.exe lsrvn/lsrvn.go
go build -buildmode=c-shared -o screen.dll screenDll/screenDll.go
mv *.exe *.dll *.h dist/