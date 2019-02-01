package com.abstractfactory;
//为color和shape创建抽象类来获取工厂
public abstract class AbstractFactory {
	 public abstract Color getColor(String color);
	  public abstract Shape getShape(String shape) ;
}
