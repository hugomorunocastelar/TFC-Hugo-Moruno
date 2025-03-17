import 'package:flutter/material.dart';

void main(List<String> args) {
  runApp(
    Center(
      child: 
        Text(
          "Hola Flutter, he recargado la app", 
          textDirection: TextDirection.ltr, 
          style: TextStyle(color: Color.fromARGB(255, 114, 224, 209)),
        )
    )
  ); 
}
