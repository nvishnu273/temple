#!/bin/sh
arg1="$1"
kvrgx2='/^(.*?):(.*)/gm'
kvrgx='^([^/]*):(.*)'

fn='^(.*)\.'


if [ -f $arg1 ]; then
	if [[ $arg1 =~ $fn ]]
	then
		echo "${BASH_REMATCH[1]}->"
	fi
	#Read a line and process if not emppty [[ -n "$line"]]
	while IFS='\n' read -r line || [[ -n "$line" ]]; do
		if [[ $line =~ $kvrgx ]]; 
		then			
			#echo $line
			key="${BASH_REMATCH[1]}"
			val="${BASH_REMATCH[2]}"
			echo "${key}->${val}"
		#else
			#echo "$line doesn't match" >&2
			#echo "Doesn't match"
			#echo "$line"
		fi		
	done < "$1"
else
	echo "The file does not exist"
fi

