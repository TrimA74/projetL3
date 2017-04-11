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
<<<<<<< HEAD
			echo $file
    		if [ $file != "meta_donnees_LaTeX.txt" ]
    		then
    			mv "$file" "`basename "$file" .txt`.csv"
    		fi
=======
			if [ $file != "meta_donnees_LaTeX.txt" ]
			then
    		mv "$file" "`basename "$file" .txt`.csv"
			fi
>>>>>>> f5018589e7e72f516874953f5a7f6911168489d0
		done
	cd ..
	rm $param
	echo "txt  to  csv execute"
done


