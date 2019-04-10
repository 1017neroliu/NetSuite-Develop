package com.proxy;

public class ProxyImage implements Image{
	 
	   private RealImage realImage;
	   private String fileName;
	 
	   public ProxyImage(String fileName){//fileName就是test_10mb.jpg
	      this.fileName = fileName;
	   }
	 //ProxyImage实现Image接口，并实现其中的方法，对这个方法进行控制，当RealImage为null时，返回一个RealImage实例
	   @Override
	   public void display() {
	      if(realImage == null){
	         realImage = new RealImage(fileName);//调用loadFromDisk方法后，继续调用display方法
	      }
	      realImage.display();
	   }
	}
