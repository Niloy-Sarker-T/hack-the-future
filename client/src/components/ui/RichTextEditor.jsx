import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Youtube from "@tiptap/extension-youtube";
import OrderList from "@tiptap/extension-ordered-list";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./dialog";
import { Input } from "./input";
import { toast } from "sonner";
import {
  Bold,
  Heading3,
  Heading4,
  Italic,
  Link as LinkIcon,
  List,
  ListCheck,
  ListOrdered,
  Underline as UnderlineIcon,
} from "lucide-react";

export default function RichTextEditor({ content, onChange }) {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isYoutubeDialogOpen, setIsYoutubeDialogOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [3, 4] },
      }),
      Underline,
      Link.configure({
        protocols: ["http", "https", "mailto", "tel", "ftp"],
        autolink: true,
        openOnClick: true,
      }),
      TaskList,
      TaskItem,
      OrderList,

      Youtube.configure({
        controls: false,
        width: 480,
        height: 320,
        allowFullscreen: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleYoutubeSubmit = () => {
    if (editor && youtubeUrl) {
      editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run();

      toast.success("YouTube video embedded");
      setIsYoutubeDialogOpen(false);
      setYoutubeUrl("");
    }
  };

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);

    if (url === null) return; // Cancelled
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
          variant="outline"
          className={
            editor?.isActive("heading", { level: 3 }) ? "text-primary/30" : ""
          }
        >
          <Heading3 className="w-4 h-4" />
        </Button>
        <Button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 4 }).run()
          }
          variant="outline"
          className={
            editor?.isActive("heading", { level: 4 }) ? "text-primary/30" : ""
          }
        >
          <Heading4 className="w-4 h-4" />
        </Button>
        <Button onClick={() => setIsYoutubeDialogOpen(true)} variant="outline">
          YouTube
        </Button>
        <Button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          variant="outline"
          className={editor?.isActive("bold") ? "text-primary/30" : ""}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          variant="outline"
          className={editor?.isActive("italic") ? "text-primary/30" : ""}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          variant="outline"
          className={editor?.isActive("underline") ? "text-primary/30" : ""}
        >
          <UnderlineIcon className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          variant="outline"
          className={editor?.isActive("bulletList") ? "text-primary/30" : ""}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          variant="outline"
          className={editor?.isActive("orderedList") ? "text-primary/30" : ""}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => editor?.chain().focus().toggleTaskList().run()}
          variant="outline"
          className={editor?.isActive("taskList") ? "text-primary/30" : ""}
        >
          <ListCheck className="w-4 h-4" />
        </Button>
        <Button
          onClick={setLink}
          variant="outline"
          className={editor?.isActive("link") ? "text-primary/30" : ""}
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
      </div>

      <EditorContent
        onClick={() => editor?.chain().focus().run()}
        editor={editor}
        className="min-h-[400px] max-h-[400px] box-decoration-clone"
      />

      <Dialog open={isYoutubeDialogOpen} onOpenChange={setIsYoutubeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add YouTube Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 pb-4">
            <Input
              placeholder="Enter YouTube URL"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
            <DialogFooter>
              <Button onClick={handleYoutubeSubmit}>Add</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
