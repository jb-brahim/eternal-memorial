"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiCall } from "@/lib/auth"
import { CheckCircle, Trash2 } from "lucide-react"

interface Report {
  _id: string
  targetId: string
  targetType: string
  reason: string
  description?: string
  reporterId: {
    _id: string
    name: string
    email: string
  }
  status: string
  createdAt: string
  reviewedBy?: {
    _id: string
    name: string
    email: string
  }
  reviewedAt?: string
  targetDetails?: {
    content?: string    // For comments
    name?: string       // For memorials
    createdAt: string
    author: {
      _id: string
      name: string
      email: string
    }
  }
}

export function AdminReportsTable() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await apiCall("/api/reports")
        // Transform the data to match our needs
        setReports(data.map((report: any) => ({
          _id: report._id,
          targetId: report.targetId,
          targetType: report.targetType,
          reason: report.reason,
          description: report.description,
          reporterId: report.reporterId,
          status: report.status,
          createdAt: report.createdAt,
          reviewedBy: report.reviewedBy,
          reviewedAt: report.reviewedAt
        })))
      } catch (err) {
        console.error("Failed to fetch reports:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  const handleResolveReport = async (reportId: string) => {
    try {
      await apiCall(`/api/reports/${reportId}`, { 
        method: "PUT",
        body: JSON.stringify({ status: 'reviewed' })
      })
      setReports(reports.map((r) => (r._id === reportId ? { ...r, status: "reviewed" } : r)))
    } catch (err) {
      console.error("Failed to resolve report:", err)
    }
  }

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm("Delete this report?")) return

    try {
      await apiCall(`/api/reports/${reportId}`, { method: "DELETE" })
      setReports(reports.filter((r) => r._id !== reportId))
    } catch (err) {
      console.error("Failed to delete report:", err)
    }
  }

  const pendingReports = reports.filter((r) => r.status === "open")

  return (
    <Card className="border-border/50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground">Content Reports</CardTitle>
        <CardDescription className="text-muted-foreground">{pendingReports.length} pending reports</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading reports...</p>
        ) : pendingReports.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No pending reports</p>
        ) : (
          <div className="space-y-4">
            {pendingReports.map((report) => (
              <div key={report._id} className="border border-border/50 rounded-lg p-4 hover:bg-muted/50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground capitalize">{report.reason}</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium
                        ${report.status === 'open' ? 'bg-yellow-500/10 text-yellow-600' : 
                          report.status === 'reviewed' ? 'bg-green-500/10 text-green-600' :
                          'bg-red-500/10 text-red-600'}`}>
                        {report.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="bg-muted/50 rounded-md p-3">
                        <p className="text-sm font-medium text-foreground mb-1">Reporter Details:</p>
                        <p className="text-sm text-muted-foreground">Name: {report.reporterId.name}</p>
                        <p className="text-sm text-muted-foreground">Email: {report.reporterId.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Date: {new Date(report.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="bg-muted/50 rounded-md p-3">
                        <p className="text-sm font-medium text-foreground mb-1">Reported Content:</p>
                        <p className="text-sm text-muted-foreground">
                          Type: {report.targetType.charAt(0).toUpperCase() + report.targetType.slice(1)}
                        </p>
                        
                        {report.targetDetails && (
                          <>
                            <div className="mt-2 border-t border-border/50 pt-2">
                              <p className="text-sm font-medium text-foreground mb-1">Content Author:</p>
                              <p className="text-sm text-muted-foreground">Name: {report.targetDetails.author.name}</p>
                              <p className="text-sm text-muted-foreground">Email: {report.targetDetails.author.email}</p>
                              <p className="text-sm text-muted-foreground">
                                Date: {new Date(report.targetDetails.createdAt).toLocaleString()}
                              </p>
                            </div>

                            <div className="mt-2 border-t border-border/50 pt-2">
                              {report.targetType === 'comment' ? (
                                <>
                                  <p className="text-sm font-medium text-foreground mb-1">Comment Content:</p>
                                  <p className="text-sm text-muted-foreground italic">"{report.targetDetails.content}"</p>
                                </>
                              ) : (
                                <>
                                  <p className="text-sm font-medium text-foreground mb-1">Memorial Name:</p>
                                  <p className="text-sm text-muted-foreground">{report.targetDetails.name}</p>
                                  <Button
                                    variant="link"
                                    size="sm"
                                    onClick={() => window.open(`/memorials/${report.targetId}`, '_blank')}
                                    className="h-auto p-0 mt-1 text-primary hover:text-primary/80"
                                  >
                                    View Memorial
                                  </Button>
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </div>                      {report.description && (
                        <div className="bg-muted/50 rounded-md p-3">
                          <p className="text-sm font-medium text-foreground mb-1">Description:</p>
                          <p className="text-sm text-foreground italic">"{report.description}"</p>
                        </div>
                      )}

                      {report.reviewedBy && (
                        <div className="bg-muted/50 rounded-md p-3">
                          <p className="text-sm font-medium text-foreground mb-1">Review Details:</p>
                          <p className="text-sm text-muted-foreground">Reviewed by: {report.reviewedBy.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Date: {new Date(report.reviewedAt || '').toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResolveReport(report._id)}
                    className="border-border/50 hover:bg-green-500/10"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark as Reviewed
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteReport(report._id)}
                    className="border-border/50 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
