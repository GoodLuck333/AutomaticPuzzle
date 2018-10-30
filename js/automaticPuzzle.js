
const init = Symbol('init'),
  imgDrawCanvas = Symbol('imgDrawCanvas');

//获取对应的CanvasRenderingContext2D对象(画笔)、图片对象
let ctx = {},
  img = {};

// 图片自动拼图
class automaticPuzzle {

  constructor({canvas, imgUrl, across, vertical}){
    //获取Canvas对象(画布)
    this.canvas = canvas;
    this.imgUrl = imgUrl;
    // 切分横、竖块数
    this.iLen = across;
    this.jLen = vertical;
    // 随机图像坐标存储对象
    this.randomObj = {};
    // 初始化
    this[init]();
  }

  // 初始化
  async [init] () {
    // 获取图片原始大小
    const imgSize = await imgOriginalSizeFn(this.imgUrl);
    // 容器 Css
    let canvasParentStyle = window.getComputedStyle(this.canvas.parentNode, null);
    // 容器宽、高
    this.wrapperW = parseInt(canvasParentStyle.width);
    this.wrapperH = parseInt(canvasParentStyle.height);
    // 图片宽、高
    this.imgW = parseInt(imgSize.width);
    this.imgH = parseInt(imgSize.height);
    // canvas 宽、高计算
    let canvasWH = canvasWHFn(this.wrapperW, this.wrapperH, this.imgW, this.imgH);
    // canvas 宽、高
    this.canvas.width = canvasWH.width;
    this.canvas.height = canvasWH.height;
    //简单地检测当前浏览器是否支持Canvas对象，以免在一些不支持html5的浏览器中提示语法错误
    if (this.canvas.getContext) {
      //获取对应的CanvasRenderingContext2D对象(画笔)
      this.ctx = this.canvas.getContext("2d");
      //创建新的图片对象
      img = new Image();
      //指定图片的URL
      img.src = this.imgUrl;
      //浏览器加载图片完毕后再绘制图片
      img.onload = () => {
        this.img = img;
        // *** img 画 canvas ***
        this[imgDrawCanvas]();
      };
    }
  }

  // *** img 画 canvas ***
  [imgDrawCanvas] (randomObj) {
    // 切分 图 / canvas 每块宽、切分 图 / canvas 每块高、宽切分个数、高切分个数、画 canvas参数
    let {ctx, img, canvas, imgW, imgH, iLen, jLen} = this,
      blockImgW = imgW / iLen,
      blockImgH = imgH / jLen,
      blockWrapperW = canvas.width / iLen,
      blockWrapperH = canvas.height / jLen;
    if (!randomObj) {
      for (let i = 0; i < iLen; i++) {
        for (let j = 0; j < jLen; j++) {
          // 图片区域起点坐标、图片区域终点坐标、canvas起点坐标、canvas终点坐标
          ctx.drawImage(img, i * blockImgW, j * blockImgH, (i + 1) * blockImgW, (j + 1) * blockImgH, i * blockWrapperW, j * blockWrapperH, (i + 1) * blockWrapperW, (j + 1) * blockWrapperH);
        }
      }
    } else {
      for (let i in randomObj) {
        for (let j in randomObj[i]) {
          let item = randomObj[i][j];
          // 图片区域起点坐标、图片区域终点坐标、canvas起点坐标、canvas终点坐标
          ctx.drawImage(img, item.x * blockImgW, item.y * blockImgH, (item.x + 1) * blockImgW, (item.y + 1) * blockImgH, parseInt(i) * blockWrapperW, parseInt(j) * blockWrapperH, (item.x + 1) * blockWrapperW, (item.y + 1) * blockWrapperH);
          // 判断是否找到对应块
          if (item.x === parseInt(i) && item.y === parseInt(j)) {
            randomObj[i][j].status = true;
          }
        }
      }
      return randomObj;
    }
  }

  // 拼图打乱
  puzzleDisorganize () {
    // canvas、随机对象、横切块数、竖切块数
    let {canvas, randomObj, iLen, jLen} = this;
    // 有随机对象且已开始还原
    if (randomObj && canvas.timer) return false;
    randomObj = this[imgDrawCanvas](randomImgObj({iLen, jLen}));
    // 回传
    this.randomObj = randomObj;
  }

  // 根据乱序拼图随机图片自动还原
  puzzleStart (speed) {
    // canvas、随机对象、横切块数、竖切块数
    let {canvas, randomObj, iLen, jLen} = this;
    // 计时器存在时不开启新的还原
    if (canvas.timer) return -1;
    // 完成还原不开启新的还原
    if (!canvas.timer && checkedIsClear(randomObj)) return false;
    canvas.timer = setInterval(() => {
      if (randomObj && checkedIsClear(randomObj)) {
        clearInterval(canvas.timer);
        // 删除属性，用于重启
        delete canvas.timer;
      }
      // img 画 canvas
      randomObj = this[imgDrawCanvas](randomImgObj({randomObj, iLen, jLen}));
      // 回传随机对象
      this.randomObj = randomObj;
    }, speed);
    return true;
  }

  // 停止拼图
  puzzleStop () {
    // canvas、随机对象
    let {canvas, randomObj} = this;
    // 没产生随机对象且未开始还原
    if (!(randomObj && canvas.timer)) return false;
    clearInterval(canvas.timer);
    // 删除属性，用于重启
    delete canvas.timer;
    return true;
  }

};

// 检查是否已完全找到对的块，是则清除定时器
checkedIsClear = (randomObj) => {
  if (randomObj) {
    for (let i in randomObj) {
      for (let j in randomObj[i]) {
        if (!randomObj[i][j].status) return false;
      }
    }
    return true;
  }
},

// 随机数组
randomImgObj = ({randomObj = {}, iLen, jLen}) => {
  // 随机图像坐标存储对象
  for (let i = 0; i < iLen; i++) {
    if (!randomObj[i]) randomObj[i] = {};
    for (let j = 0; j < jLen; j++) {
      if (randomObj[i][j] && randomObj[i][j].status) {
        continue;
      }
      randomObj[i][j] = {x: randomFn({max: iLen - 1}), y: randomFn({max: jLen - 1}), status: false};
    }
  }
  return randomObj;
},

// 随机数方法
randomFn = ({min = 0, max}) => {
  return Math.floor(Math.random() * ( max - min + 1) + min);
},



// 计算 canvas 宽、高
canvasWHFn = (wrapperW, wrapperH, imgW, imgH) => {
  // 图宽、高比
  let imgAspectRatio = imgW / imgH,
    // 容器宽、高比
    wrapperAspectRatio = wrapperW / wrapperH,
    // 返回宽、高
    width = 0,
    height = 0;
  if (imgAspectRatio > wrapperAspectRatio) {
    // 图宽、高比 > 容器宽、高比时，按容器宽为100%计算高
    width = wrapperW;
    height = width / imgAspectRatio;
  } else if (imgAspectRatio < wrapperAspectRatio) {
    // 图宽、高比 < 容器宽、高比时，按容器高为100%计算宽
    height = wrapperH;
    width = height * imgAspectRatio;
  } else {
    // 图宽、高比 === 容器宽、高比时，按容器宽、高为canvas宽高
    width = wrapperW;
    height = wrapperH;
  }
  return {width, height}
},

// 获取图片原始大小
imgOriginalSizeFn = (imgUrl) => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.src = imgUrl;
    img.onload = function () {  //图片加载完成
       resolve({
         width: img.width,
         height: img.height
       });
    };
  });
};
