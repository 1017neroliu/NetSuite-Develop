package com.proxy;

public class ProxyPatternDemo {
//	当被请求时，使用 ProxyImage 来获取 RealImage 类的对象
	   public static void main(String[] args) {
	      Image image = new ProxyImage("test_10mb.jpg");//父类引用指向子类对象，携带参数test_10mb.jpg
	 
	      // 图像将从磁盘加载
	      image.display(); 
	      System.out.println("");
	      // 图像不需要从磁盘加载
	      image.display();  
	   }
	}
