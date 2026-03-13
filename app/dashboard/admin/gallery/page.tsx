"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { Plus, ImageIcon, Trash2, Eye, Upload, FolderOpen } from "lucide-react"
import { format } from "date-fns"

interface GalleryItem {
  id: string
  title: string
  description: string
  category: string
  image_url: string
  event_date: string
  is_featured: boolean
  created_at: string
}

const categories = [
  { value: "events", label: "Events" },
  { value: "sports", label: "Sports Day" },
  { value: "cultural", label: "Cultural Programs" },
  { value: "academic", label: "Academic" },
  { value: "campus", label: "Campus Life" },
  { value: "achievements", label: "Achievements" }
]

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null)
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    category: "events",
    image_url: "",
    event_date: "",
    is_featured: false
  })
  const supabase = createClient()

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    setIsLoading(true)
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .order("event_date", { ascending: false })

    if (data) setItems(data)
    setIsLoading(false)
  }

  async function handleAddItem() {
    const { error } = await supabase.from("gallery").insert(newItem)

    if (!error) {
      setIsAddOpen(false)
      setNewItem({
        title: "",
        description: "",
        category: "events",
        image_url: "",
        event_date: "",
        is_featured: false
      })
      fetchItems()
    }
  }

  async function handleDeleteItem(id: string) {
    await supabase.from("gallery").delete().eq("id", id)
    fetchItems()
  }

  const filteredItems = selectedCategory === "all" 
    ? items 
    : items.filter((item) => item.category === selectedCategory)

  const featuredItems = items.filter((item) => item.is_featured)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Photo Gallery</h1>
          <p className="text-muted-foreground">Manage school photos and media</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Photo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Photo</DialogTitle>
              <DialogDescription>Upload a new photo to the gallery</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input 
                  placeholder="Photo title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea 
                  placeholder="Photo description..."
                  rows={2}
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Image URL</Label>
                <Input 
                  placeholder="https://example.com/image.jpg"
                  value={newItem.image_url}
                  onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select 
                    value={newItem.category} 
                    onValueChange={(v) => setNewItem({ ...newItem, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Event Date</Label>
                  <Input 
                    type="date"
                    value={newItem.event_date}
                    onChange={(e) => setNewItem({ ...newItem, event_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="featured" 
                  checked={newItem.is_featured}
                  onChange={(e) => setNewItem({ ...newItem, is_featured: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="featured">Mark as Featured</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem}>Add Photo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-muted-foreground">In gallery</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{featuredItems.length}</div>
            <p className="text-xs text-muted-foreground">Photos featured</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Photo categories</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button 
          variant={selectedCategory === "all" ? "default" : "outline"} 
          size="sm"
          onClick={() => setSelectedCategory("all")}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button 
            key={cat.value}
            variant={selectedCategory === cat.value ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Loading gallery...
          </CardContent>
        </Card>
      ) : filteredItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Photos Found</h3>
            <p className="text-muted-foreground mb-4">Add your first photo to the gallery</p>
            <Button onClick={() => setIsAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Photo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="aspect-video relative bg-muted">
                {item.image_url ? (
                  <img 
                    src={item.image_url || "/placeholder.svg"} 
                    alt={item.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button 
                    size="icon" 
                    variant="secondary"
                    onClick={() => setPreviewItem(item)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="destructive"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {item.is_featured && (
                  <Badge className="absolute top-2 right-2 bg-primary">Featured</Badge>
                )}
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium truncate">{item.title}</h3>
                <div className="flex items-center justify-between mt-1">
                  <Badge variant="outline" className="text-xs capitalize">
                    {item.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {item.event_date && format(new Date(item.event_date), "MMM yyyy")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="max-w-3xl">
          {previewItem && (
            <>
              <DialogHeader>
                <DialogTitle>{previewItem.title}</DialogTitle>
                <DialogDescription>
                  {previewItem.event_date && format(new Date(previewItem.event_date), "dd MMMM yyyy")} | {previewItem.category}
                </DialogDescription>
              </DialogHeader>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                {previewItem.image_url ? (
                  <img 
                    src={previewItem.image_url || "/placeholder.svg"} 
                    alt={previewItem.title}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              {previewItem.description && (
                <p className="text-muted-foreground">{previewItem.description}</p>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
