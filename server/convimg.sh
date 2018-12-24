#!/bin/bash
repositorydir="/Volumes/0wew0-1T/dress/Dress"
albumdir="/Volumes/0wew0-1T/dress/GitDressViewer/album"
echo "【批量压缩相册】"
echo "本地仓库路径: $repositorydir"
echo "图片缓存路径: $albumdir"
echo "清空缓存路径..."
rm -rf "$albumdir"
mkdir "$albumdir"
allimg=0
echo "列出相册..."
cd "$repositorydir"
for albumdf in `ls -1 -t -A 2>/dev/null`
do
    olddf="$repositorydir/$albumdf"
    newdf="$albumdir/$albumdf"
    if [ -d $repositorydir"/"$albumdf ]
    then
        echo "创建文件夹: $newdf ..."
        mkdir "$newdf"
        fileid=0
        cd "$olddf"
        echo "[" >> "$newdf/info.json"
        for nowimg in `
        find . -iname "*.jpg" 2>/dev/null | tr " " "\?" &&
        find . -iname "*.jpeg" 2>/dev/null | tr " " "\?" &&
        find . -iname "*.png" 2>/dev/null | tr " " "\?" &&
        find . -iname "*.webp" 2>/dev/null | tr " " "\?" &&
        find . -iname "*.bmp" 2>/dev/null | tr " " "\?"`
        do
            nowimg=`tr "\?" " " <<<$nowimg`
            nowimg=${nowimg:2}
            oldimg="$olddf/$nowimg"
            fileid=`expr $fileid + 1`
            allimg=`expr $allimg + 1`
            echo "[$allimg]转换图像: $oldimg"
            newimg="$newdf/$fileid-s.webp"
            echo "到: $newimg ..."
            convert -resize "128x128>" -quality 50 "$oldimg" "$newimg"
            identify -format "[%[fx:w],%[fx:h]," "$newimg" >> "$newdf/info.json"
            newimg="$newdf/$fileid-m.webp"
            echo "到: $newimg ..."
            convert -resize "1024x1024>" -quality 90 "$oldimg" "$newimg"
            identify -format "%[fx:w],%[fx:h]]," "$newimg" >> "$newdf/info.json"
        done
        for nowimg in `ls -1 -t -A *.md *.MD 2>/dev/null | tr " " "\?"`
        do
            nowimg=`tr "\?" " " <<<$nowimg`
            oldimg="$olddf/$nowimg"
            newimg="$newdf/$nowimg.html"
            echo "转换自述文件: $oldimg"
            echo "到: $newimg ...";
            markdown2 "$oldimg" > "$newimg"
        done
        fileid=0
        echo "]" >> "$newdf/info.json"
        if [ ! -f "$newdf/README.md.html" ];then
            blankreadme="$newdf/README.md.html"
            echo "创建空白自述文件: $blankreadme"
            echo "" > $blankreadme
        fi
    else
        echo "复制文件: $olddf"
        echo "到: $newdf ...";
        cp -f "$olddf" "$newdf"
    fi
done
