package com.practice;

import java.util.Random;

public class suijishu {
	public static void main(String[] args) {
		Random number = new Random();
		int n = number.nextInt(6) + 1;
		System.out.println(n);
	}
}
