import { cn } from '@/lib/utils'
import clsx from 'clsx'
import React from 'react'

type Props = {
    isCorrect: boolean | null,
    correctAnswer: string
}

const ResultCard = (props: Props) => {
    const { correctAnswer, isCorrect } = props

    if (isCorrect === null) {
        return null
    }

    const text = isCorrect ? "Correct!" : `Incorrect! Answer: ${correctAnswer}`

    const classes = clsx({
        "border-green-500": isCorrect,
        "border-red-500": !isCorrect,
    })

    return (
        <div className={cn(classes, 'border-2', 'rounded-lg', 'p-4', 'text-center', 'text-lg', 'font-semibold', 'my-4', 'bg-secondary')}>{text}</div>
    )
}

export default ResultCard