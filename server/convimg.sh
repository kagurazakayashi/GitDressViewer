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
        for nowimg in `ls -1 -t -A *.jpg *.JPG *.jpeg *.JPEG *.png *.PNG 2>/dev/null | tr " " "\?"`
        do
            nowimg=`tr "\?" " " <<<$nowimg`
            oldimg="$olddf/$nowimg"
            fileid=`expr $fileid + 1`
            allimg=`expr $allimg + 1`
            newimg="$newdf/$fileid.webp"
            echo "[$allimg]转换图像: $oldimg"
            echo "到: $newimg ...";
            convert -resize "1024x1024>" "$oldimg" "$newimg"
        done
        for nowimg in `ls -1 -t -A *.webp *.WEBP 2>/dev/null | tr " " "\?"`
        do
            nowimg=`tr "\?" " " <<<$nowimg`
            oldimg="$olddf/$nowimg"
            fileid=`expr $fileid + 1`
            allimg=`expr $allimg + 1`
            newimg="$newdf/$fileid.webp"
            echo "[$allimg]复制已转换图像: $oldimg"
            echo "到: $newimg ...";
            cp "$oldimg" "$newimg"
        done
        for nowimg in `ls -1 -t -A *.md *.MD 2>/dev/null | tr " " "\?"`
        do
            nowimg=`tr "\?" " " <<<$nowimg`
            oldimg="$olddf/$nowimg"
            newimg="$newdf/$nowimg"
            echo "复制自述文件: $oldimg"
            echo "到: $newimg ...";
            cp "$oldimg" "$newimg"
        done
        fileid=0
    else
        echo "复制文件: $olddf"
        echo "到: $newdf ...";
        cp -f "$olddf" "$newdf"
    fi
done
