cat components.txt | while read line
do
   yo fountain-angular1:component --name $line --dir $line
done
