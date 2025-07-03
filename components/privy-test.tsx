"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function PrivyTest() {
  const [testAppId, setTestAppId] = useState("")
  const [testResult, setTestResult] = useState<string | null>(null)

  const testAppIdFormat = () => {
    const currentAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID
    const isValidFormat = /^[a-z0-9]{25,30}$/.test(currentAppId || "")

    setTestResult(`
Current App ID: ${currentAppId}
Length: ${currentAppId?.length || 0}
Valid Format: ${isValidFormat ? "✅" : "❌"}
Expected Format: 25-30 lowercase letters/numbers
Your ID: ${currentAppId}
    `)
  }

  const testCustomAppId = () => {
    const isValidFormat = /^[a-z0-9]{25,30}$/.test(testAppId)
    setTestResult(`
Test App ID: ${testAppId}
Length: ${testAppId.length}
Valid Format: ${isValidFormat ? "✅" : "❌"}
    `)
  }

  return (
    <Card className="mt-4 border-purple-200 bg-purple-50">
      <CardHeader>
        <CardTitle className="text-sm">Privy App ID Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Button onClick={testAppIdFormat} size="sm" variant="outline">
            Test Current App ID
          </Button>
        </div>

        <div className="space-y-2">
          <Input placeholder="Test different App ID" value={testAppId} onChange={(e) => setTestAppId(e.target.value)} />
          <Button onClick={testCustomAppId} size="sm" variant="outline">
            Test Custom ID
          </Button>
        </div>

        {testResult && <pre className="text-xs bg-white p-2 rounded border whitespace-pre-wrap">{testResult}</pre>}

        <div className="text-xs text-purple-700">
          <p>
            <strong>Your App ID:</strong> cmcne26uk032oju0mrd9qo62x
          </p>
          <p>
            <strong>Length:</strong> {`cmcne26uk032oju0mrd9qo62x`.length}
          </p>
          <p>
            <strong>Valid:</strong> {/^[a-z0-9]{25,30}$/.test("cmcne26uk032oju0mrd9qo62x") ? "✅" : "❌"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
