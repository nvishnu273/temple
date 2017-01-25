#!/bin/sh

ARG1="$1"


if [[ -f "$ARG1" ]]; then
	while read -r line
	do
		name="$line"
		tr ':' $'\n' "$name"
		echo "Name - $name"
	done < "$ARG1"
else
	echo "false"
fi



#for i in *.txt ; do
#	echo $i
#done
