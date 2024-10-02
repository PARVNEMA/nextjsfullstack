"use client";
import React from "react";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Message } from "@/model/user";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProps = {
	message: Message;
	onMessageDelete: (messageId: string) => void;
};
function MessageCard({
	message,
	onMessageDelete,
}: MessageCardProps) {
	const { toast } = useToast();
	const handleDeleteConfirm = async () => {
		const res = axios.delete<ApiResponse>(
			`/api/delete-message/${message._id}`
		);

		toast({
			title: res.data.message,
			variant: "destructive",
		});
		onMessageDelete(message._id);
	};
	return (
		<Card>
			<CardHeader>
				<CardTitle>Card Title</CardTitle>
				<CardDescription>Card Description</CardDescription>
			</CardHeader>
			<Button
				variant="outline"
				onClick={handleDeleteConfirm}
			>
				delete
			</Button>
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button variant="outline">Show Dialog</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you absolutely sure?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will
							permanently delete your account and remove
							your data from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction>Continue</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Card>
	);
}

export default MessageCard;
