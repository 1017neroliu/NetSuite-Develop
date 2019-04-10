package com.factory;

import com.abstractfactory.Shape;

//使用该工厂，通过传递类型信息来获取实体类对象
public class FactoryPatternDemo {
	public static void main(String[] args) {
		/**
		 * 平时我们创建对象的时候，是Shape shape1 = new Shape();
		 * 
		 * 现在是先创建一个工厂对象shapeFactory，用这个工厂对象类中的getShape()方法区获取对象，
		 * 这个方法中有参数，这个参数就是指定了你要创建的对象的类型。Shape是一个接口，接口中有个方法，
		 * 接口的各个实体类都有各自的方法矩形，方形，圆形，创建一个形状的对象，这个对象是抽象的，可以是
		 * 圆形，矩形，方形，接口的实现类分别对应具体的实例，通过创建工厂，获取工厂类中的方法，即get对象的方法
		 * 如果你需要的创建对象的类型是圆形？方形？矩形？就返回一个这个对象的实现类，这个类型的实现类中有个方法
		 * 就是具体的逻辑。
		 */
		ShapeFactory shapeFactory = new ShapeFactory();//创建工厂
		//获取 Circle 的对象，并调用它的 draw 方法
	      Shape shape1 = shapeFactory.getShape("CIRCLE");
	      /**
	       * 这个方法返回值类型是Shape，调用工厂中的getShape()方法，这个方法返回了一个new的实例，
	       * 相当于new了一个对象，返回的shape1就是Circle对象
	       */
	 
	      //调用 Circle 的 draw 方法
	      shape1.draw();
	 
	      //获取 Rectangle 的对象，并调用它的 draw 方法
	      Shape shape2 = shapeFactory.getShape("RECTANGLE");
	      //调用 Rectangle 的 draw 方法
//	      shape2.draw();
//	      Rectangle Rectangle = new Rectangle();
//	      Rectangle.test();
	      Rectangle Rectangle = (Rectangle) shape2;
	      Rectangle.test();
	      //获取 Square 的对象，并调用它的 draw 方法
	      Shape shape3 = shapeFactory.getShape("SQUARE");
	 
	      //调用 Square 的 draw 方法
	      shape3.draw();
	} 
}
