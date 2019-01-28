#!/bin/bash
# GitDressViewer 图像压缩器
# <设置>
# 注：所有路径建议用绝对路径。不要以/结尾。由于操作前会清空文件夹，请不要放自己其他的网页，更不要直接设置为/，将会导致删光光……
# 设定克隆到本地的 Dress 项目路径(不以/结尾)
repositorydir="/mnt/e/Github/Dress"
# 设定临时文件夹路径(不以/结尾)
tempdir="/mnt/b/t"
# 设定为本仓库路径/html/album(不以/结尾,不要修改/html/album)
albumdir="/mnt/e/www/GitDressViewer/html/album"
# 缩略图分辨率(显示在目录页,最大边不会超过此分辨率)
resolutionsmall="512x512"
# 大图分辨率(最大边不会超过此分辨率)
resolutionbig="1920x1080"
# 缩略图清晰度百分比
qualitysmall="20"
# 大图清晰度百分比
qualitybig="80"
# </设置>

echo "【批量压缩相册】"
echo "本地仓库路径: $repositorydir"
echo "图片缓存路径: $albumdir"
echo "清空临时文件夹..."
rm -rf "$tempdir"
mkdir "$tempdir"
allimg=0
allimgp=0
allimga=0
echo "列出相册..."
albumlist="$tempdir/list.json"
echo "[" > "$albumlist"
cd "$repositorydir"
echo "统计文件数量..."
for pimg in `
    find . -iname "*.jpg" 2>/dev/null | tr " " "\?" &&
    find . -iname "*.jpeg" 2>/dev/null | tr " " "\?" &&
    find . -iname "*.png" 2>/dev/null | tr " " "\?" &&
    find . -iname "*.webp" 2>/dev/null | tr " " "\?" &&
    find . -iname "*.bmp" 2>/dev/null | tr " " "\?"`
do
    allimgp=`expr $allimgp + 1`
done
for palbumdf in `ls -1 -t 2>/dev/null | tr " " "\?"`
do
    palbumdf=`tr "\?" " " <<<$palbumdf`
    if [ -d "$repositorydir/$palbumdf" ]
then
    allimga=`expr $allimga + 1`
else
    allimgp=`expr $allimgp - 1`
fi
done
echo "预计文件数量: $allimgp"
echo "预计相册数量: $allimga"
echo "开始建立缓存文件结构..."
for albumdf in `ls -1 -t 2>/dev/null | tr " " "\?"`
do
    albumdf=`tr "\?" " " <<<$albumdf`
    olddf="$repositorydir/$albumdf"
    newdf="$tempdir/$albumdf"
    if [ -d "$repositorydir/$albumdf" ]
    then
        echo "创建文件夹: $newdf ..."
        echo "\"$albumdf\"," >> "$albumlist"
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
            echo "[ $allimg.0 / $allimgp ] 转换图像: $oldimg"
            newimg="$newdf/$fileid-s.webp"
            echo "[ $allimg.1 / $allimgp ] 到: $newimg ..."
            convert -resize "$resolutionsmall>" -quality $qualitysmall "$oldimg" "$newimg"
            newimg="$newdf/$fileid-m.webp"
            echo "[ $allimg.2 / $allimgp ] 到: $newimg ..."
            convert -resize "$resolutionbig>" -quality $qualitybig "$oldimg" "$newimg"
            newimg="$newdf/$fileid-s.jpg"
            echo "[ $allimg.3 / $allimgp ] 到: $newimg ..."
            convert -resize "$resolutionsmall>" -quality $qualitysmall "$oldimg" "$newimg"
            identify -format "[%[fx:w],%[fx:h]," "$newimg" >> "$newdf/info.json"
            newimg="$newdf/$fileid-m.jpg"
            echo "[ $allimg.4 / $allimgp ] 到: $newimg ..."
            convert -resize "$resolutionbig>" -quality $qualitybig "$oldimg" "$newimg"
            identify -format "%[fx:w],%[fx:h]]," "$newimg" >> "$newdf/info.json"
        done
        for nowimg in `ls -1 -t *.md *.MD 2>/dev/null | tr " " "\?"`
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
            echo "" > "$blankreadme"
        fi
    else
        echo "复制文件: $olddf"
        echo "到: $newdf ...";
        cp -f "$olddf" "$newdf"
    fi
done
echo "创建相册列表 $albumlist ..."
echo "]" >> "$albumlist"
echo "清空缓存路径..."
rm -rf "$albumdir"
echo "移动临时文件到缓存路径..."
mv -fv "$tempdir" "$albumdir"
date > "$albumdir/finishtime.txt"
echo "操作全部完成，对 $allimga 个相册中的 $allimg 张图像进行了转换。"