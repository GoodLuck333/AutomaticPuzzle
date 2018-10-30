# AutomaticPuzzle

An auto-undo puzzle effect

随机还原拼图（Canvas实现）

在线浏览：https://goodluck333.github.io/AutomaticPuzzle/

### 主要功能：

>* 将整张图片拆分n行m列个小图块，随机打乱顺序;
>* 开始随机还原拼图，找到对应拼图块则不进行下一轮，直到完整还原;
>* 停止随机还原拼图，定格当前位置，可继续开启或重新打乱;

### 思路：

> 我也不知道为啥要写这个，还是写了！
>
>* 一开始在想用什么办法来解决 图片切块&&显示的问题？（如何切块显示？后面说，先看基础问题）
>>
>> 1、n * m 块div，设置背景图;
>>
>> 2、canvas;
>>
>> 第一种，需要很多小图拼接成一个完成的大图。需计算每小块图背景图所在的位置，但n、m值过大会导致浏览器性能下降。
>>
>> 第二种，只需要一个canvas即可，需计算每小块图所要画的位置，n、m值大小并无影响。
>>
>> 选 canvas！
>
>* 设计之初，得先考虑到图片原始大小和容器大小的问题！（计算canvas宽、高的方法）
>>
>> 图片原始大小大、小和容器大、小不可能一致，导至图片宽、高比和容器宽、高比不成比例。如果直接渲染的话会导致图片展示不全的BUG！
>> 
>> 在初始化的时候需要拿到容器的width和height、图片原始的width和height;
>> 
>> 试想一：容器特别宽，那你canvas是不是只能用容器的高做canvas的高，宽用比例去计算出来;
>>
>> 试想二：容器特别高，那你canvas是不是只能用容器的宽做canvas的宽，高用比例去计算出来;
>>
>> 试想三：容器和canvas是同一比例，但只是大小不同，canvas完全与容器宽、高相等;
>>
>> canvas是以容器为基础的，永远不能超出容器;
>>
>* 已经算出了canvas的宽、高，设置canvas的宽、高！
>>
>* 该画 canvas 了！但是得想一下如何给canvas画上图片不同位置切好的小块图片？
>>
>> drawImage(image, int imageX, int imageY, int imageWidth, int imageHeight, int canvasX, int canvasY, int canvasWidth, int canvasHeight)
>> 
>> ctx.drawImage 给了很多参数，把这些参数都弄懂就OK！
>>
>> image：图片对象;
>>
>> imageX、imageY、imageWidth、imageHeight 能组合出在图片上的一个区域，这是要画到canvas的图片区域;
>>
>> canvasX、canvasY、canvasWidth、canvasHeight 能组合出在canvas上的一个区域;
>>
>* 画canvas的核心已经解决了，然后循环画一整张的canvas就完成整面canvas;
>>
>> 
>>
>>
>>


