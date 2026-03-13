'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

interface Subject {
  id: string
  name: string
  class_id: string
  classes?: {
    name: string
    section: string
  }
}

interface Class {
  id: string
  name: string
  section: string
}

interface AddHomeworkDialogProps {
  children: React.ReactNode
  subjects: Subject[]
  classes: Class[]
  teacherId?: string
}

export function AddHomeworkDialog({ children, subjects, classes, teacherId }: AddHomeworkDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject_id: '',
    class_id: '',
    due_date: ''
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!teacherId) {
      setError('Teacher ID not found')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClient()

    const { error: insertError } = await supabase
      .from('homework')
      .insert({
        title: formData.title,
        description: formData.description || null,
        subject_id: formData.subject_id,
        class_id: formData.class_id,
        teacher_id: teacherId,
        due_date: formData.due_date
      })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    setOpen(false)
    setFormData({ title: '', description: '', subject_id: '', class_id: '', due_date: '' })
    router.refresh()
  }

  // Filter classes based on selected subject
  const selectedSubject = subjects.find(s => s.id === formData.subject_id)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Homework</DialogTitle>
          <DialogDescription>
            Assign a new homework to your class
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Chapter 5 Exercise"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Detailed instructions for the homework..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject_id">Subject</Label>
              <Select
                value={formData.subject_id}
                onValueChange={(value) => {
                  const subject = subjects.find(s => s.id === value)
                  setFormData({ 
                    ...formData, 
                    subject_id: value,
                    class_id: subject?.class_id || ''
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name} ({subject.classes?.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="class_id">Class</Label>
              <Select
                value={formData.class_id}
                onValueChange={(value) => setFormData({ ...formData, class_id: value })}
                disabled={!formData.subject_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} - {cls.section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Homework'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
