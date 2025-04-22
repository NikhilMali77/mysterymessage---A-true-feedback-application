'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/models/User"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"
type MessageCardProps = {
    // key: (messageId : string) => void
    message: Message;
    onMessageDelete: (messageId: string) => void
}
function MessageCard({ message, onMessageDelete}: MessageCardProps) {
    const handleDeleteConfirm = async () => {
        await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        toast.success("Deleted", {
            "description": "Message Deleted successfully"
        })
    }
    return (
        <Card>
            <CardHeader>
                <AlertDialog>
                    <AlertDialogTrigger>
                        <Button variant="destructive">< X className="w-5 h-5" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardHeader>
            <CardContent>
                <p>{message.content}</p>
            </CardContent>
        </Card>

    )
}

export default MessageCard