import { useState } from "react"
import { Button } from "./button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog"
import { Input } from "./input"
import { toast } from "sonner"
import useHackathonStore from "@/store/hackathon-store"

export function ImageUpload({ currentImage, onUpload, hackathonId, type }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      // Here you would implement your actual upload logic
      // For now, we'll just simulate it
      const res = await useHackathonStore.getState().uploadImage(selectedFile, type, hackathonId)
      
      // Update the store with the new image URL
      onUpload(res.data.url)
      
      toast.success("Image uploaded successfully")
      
      setIsDialogOpen(false)
      setSelectedFile(null)
    } catch (error) {
      toast.error("Failed to upload image")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
        {currentImage ? (
          <img src={currentImage} alt="Hackathon" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No image selected
          </div>
        )}
      </div>
      <Button onClick={() => setIsDialogOpen(true)}>
        Upload Image
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 pb-4">
            <div className="flex flex-col gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Button onClick={handleUpload}>Upload</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
