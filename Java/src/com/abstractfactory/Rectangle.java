package com.abstractfactory;

import com.abstractfactory.Shape;

//创建接口的实体类--矩形（工厂模式复杂对象）
public class Rectangle implements Shape {

	@Override
	public void draw() {
		// TODO Auto-generated method stub
		System.out.println("Inside Rectangle::draw() method.");
	}
	public void test() {
		System.out.println("123");
	}

}
