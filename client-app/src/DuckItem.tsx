import React from "react";
import { Duck } from "./demo";

interface Props {
    duck: Duck;
}

export default function DuckItem({duck}: Props) { //{duck} specify atribut yg ada di Props
    return (
        <div>
          <span>{duck.name}</span>
          <button onClick={() => duck.makeSound(duck.name + " quack")}>Make Sound</button>  
        </div>
      );
}