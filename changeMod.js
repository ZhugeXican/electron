const fs=require('fs');
const http=require('http');
const Path=require('path')
const async = require('async');
  var stat=fs.stat;
  var copy=function(src,dst){
	  //读取目录
	  fs.readdir(src,function(err,paths){
		//   console.log(paths)
		  if(err){
			  throw err;
		  }

		  paths.forEach(function(path){
			 var srcOld=src;
			 var dstOld=dst;
			  var _src=src+'/'+path;
			  var _dst=dst+'/'+path;
			  var readable;
			  var writable;
			  stat(_src,function(err,st){
				  if(err){
					  throw err;
				  }
				  if(path.indexOf('.html')!==-1){
					  copyHtml(srcOld,dstOld,path)
					return;
				}
				  if(st.isFile()){
					  readable=fs.createReadStream(_src);//创建读取流
					  writable=fs.createWriteStream(_dst);//创建写入流
					  readable.pipe(writable);
				  }else if(st.isDirectory()){
					  exists(_src,_dst,copy);
				  }
			  });
		  });
	  });
  }
  
  var exists=function(src,dst,callback){
	  //测试某个路径下文件是否存在
	  fs.exists(dst,function(exists){
		  if(exists){//不存在
			  callback(src,dst);
		  }else{//存在
			  fs.mkdir(dst,function(){//创建目录
				  callback(src,dst)
			  })
		  }
	  })
  }
  
  exists('./project','./First',copy)



var copyHtml=function(srcOld,dstOld,path){

	
	  if(!fs.existsSync('./First')){
		fs.mkdirSync('First')
	}
	
	var reg=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
	 
		var data = fs.readFileSync(`${srcOld}/${path}`, 'utf8');
		var regData=data.match(reg)
		if(regData){
			var inserFirst=`<script>if (typeof module === 'object') {window.module = module; module = undefined;}</script>${regData[0]}`
			var inserEnd=`${regData[regData.length-1]} <script>if (window.module) module = window.module;</script>`
			var reg1=new RegExp(regData[0])
			var reg2=new RegExp(regData[regData.length-1])
			var data1=data.replace(reg1,inserFirst)
			var data2=data1.replace(reg2,inserEnd)
			fs.writeFile(`${dstOld}/${path}`,data2,'utf8',function(error){
				if(error){
					console.log(error);
					return false;
				}
			})
		}else {
			fs.writeFile(`${dstOld}/${path}`,data,'utf8',function(error){
				if(error){
					console.log(error);
					return false;
				}
			})
		}
	  
	
}
  

// var data = fs.readFileSync('./\*.html', 'utf8');
// console.log(data);