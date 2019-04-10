package com.abstractfactory;

import com.abstractfactory.Shape;

//创建一个工厂，生成基于给定信息的实体类的对象
public class ShapeFactory extends AbstractFactory {
    
	   @Override
	   public Shape getShape(String shapeType){
	      if(shapeType == null){
	         return null;
	      }        
	      if(shapeType.equalsIgnoreCase("CIRCLE")){
	         return new Circle();
	      } else if(shapeType.equalsIgnoreCase("RECTANGLE")){
	         return new Rectangle();
	      } else if(shapeType.equalsIgnoreCase("SQUARE")){
	         return new Square();
	      }
	      return null;
	   }
	   
	   @Override
	   public Color getColor(String color) {
	      return null;
	   }
	}
