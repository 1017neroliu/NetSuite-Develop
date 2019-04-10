package com.proxy;

public class RealImage implements Image {
	 
	   private String fileName;
	 
	   public RealImage(String fileName){//返回的这个RealImage实例有个loadFromDisk方法
	      this.fileName = fileName;
	      loadFromDisk(fileName);
	   }
	 
	   @Override
	   public void display() {
	      System.out.println("Displaying " + fileName);
	   }
	 
	   private void loadFromDisk(String fileName){
	      System.out.println("Loading " + fileName);
	      
	   }
	   
	}
