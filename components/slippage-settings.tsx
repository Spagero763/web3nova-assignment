"use client"

import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings } from "lucide-react"

interface SlippageSettingsProps {
  slippage: number
  onSlippageChange: (value: number) => void
}

export function SlippageSettings({ slippage, onSlippageChange }: SlippageSettingsProps) {
  const preset = [0.1, 0.5, 1.0]
  const [custom, setCustom] = useState("")

  const handleCustom = (v: string) => {
    setCustom(v)
    const n = Number.parseFloat(v)
    if (!Number.isNaN(n) && n > 0 && n <= 50) onSlippageChange(n)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 p-4 space-y-4" align="end">
        <h4 className="font-medium text-sm">Slippage tolerance</h4>

        <div className="flex gap-2">
          {preset.map((p) => (
            <Button
              key={p}
              variant={slippage === p ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => {
                onSlippageChange(p)
                setCustom("")
              }}
            >
              {p}%
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Custom"
            value={custom}
            onChange={(e) => handleCustom(e.target.value)}
            min={0}
            max={50}
            step={0.1}
          />
          <span className="text-sm text-muted-foreground">%</span>
        </div>

        {slippage > 5 && (
          <p className="text-xs text-yellow-600">High slippage tolerance may result in unfavorable trades.</p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
