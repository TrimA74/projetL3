#!/bin/bash

for param in "$@"
do
	fullfilename=$(basename $param)
	filename=${fullfilename%.*}
	echo "-----------------------------"
	echo "full zip name = $fullfilename"
	echo "foldername = $filename"
 	unzip ./$param -d $filename
	cd $filename/
	sed -i -re 's/\t/,/g' *.txt | sed -i -re 's/( )//g' *.txt
		for file in *.txt; do
			if [ $file != "meta_donnees_LaTeX.txt" ]
			then
    		mv "$file" "`basename "$file" .txt`.csv"
			fi
		done
	cd ..
	rm $param
	echo "txt  to  csv execute"
done




