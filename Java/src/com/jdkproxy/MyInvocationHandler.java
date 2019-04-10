package com.jdkproxy;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
//处理器对象
//复写invoke，反射，定义一个处理器
public class MyInvocationHandler implements InvocationHandler {
	//因为要处理真实对象，所以要传进来
	Subject realSubject;
	
	public MyInvocationHandler(Subject realSubject){
		
		this.realSubject = realSubject;
	}
	
	@Override
	public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
		System.out.println("调用代理类");
		if(method.getName().equals("sellBooks")){
			int invoke = (int)method.invoke(realSubject,args);
			System.out.println("调用的是读书的方法");
			return invoke;
		}else {
			 String string = (String) method.invoke(realSubject,args) ;
	            System.out.println("调用的是说话的方法");
	            return  string ;
		}
	}
}
