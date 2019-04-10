package com.abstractfactory;

import com.abstractfactory.Shape;

//方形
public class Square implements Shape {

	@Override
	public void draw() {
		// TODO Auto-generated method stub
		System.out.println("Inside Square::draw() method.");
	}

}
