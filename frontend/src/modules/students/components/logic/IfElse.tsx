import React from 'react'
interface IfElseProps {
    condition: boolean
    children: React.ReactNode[]
}
export  function IfElse({children,condition}: IfElseProps) {
    if(condition){
        return children[0]
    }else{
        return children[1]
    }
}
