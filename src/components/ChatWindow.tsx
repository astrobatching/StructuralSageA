import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mic, Send, Share2, Edit2, Tag, Paperclip, MoreHorizontal, Download, Trash2, Copy, MessageSquare } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"

export const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: 1, content: 'Hello! How can I help?', sender: 'AI', tags: ['greeting'] },
    { id: 2, content: 'I need help with a bug', sender: 'User', tags: ['bug'] },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { id: messages.length + 1, content: inputValue, sender: 'User', tags: selectedTags }])
      setInputValue('')
      setSelectedTags([])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTagSelect = (tag: string) => {
    setSelectedTags(selectedTags.includes(tag) 
      ? selectedTags.filter(t => t !== tag) 
      : [...selectedTags, tag]
    )
  }

  const handleShare = (messageId: number, platform: string) => {
    // Implement sharing logic here
    console.log(`Sharing message ${messageId} to ${platform}`)
  }

  const handleSaveToKanban = (messageId: number) => {
    // Implement save to Kanban logic here
    console.log(`Saving message ${messageId} to Kanban`)
  }

  const handleEdit = (messageId: number) => {
    // Implement edit logic here
    console.log(`Editing message ${messageId}`)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Implement file upload logic here
    console.log('File uploaded:', event.target.files?.[0])
  }

  const handleVoiceInput = () => {
    setIsRecording(!isRecording)
    // Implement voice input logic here
  }

  const handleChatOptions = (option: string) => {
    switch (option) {
      case 'export':
        console.log('Exporting chat')
        // Implement export functionality
        break
      case 'clear':
        setMessages([])
        console.log('Clearing chat')
        break
      case 'copy':
        const chatText = messages.map(m => `${m.sender}: ${m.content}`).join('\n')
        navigator.clipboard.writeText(chatText)
        toast({
          title: "Chat copied to clipboard",
          description: "You can now paste the chat content anywhere.",
        })
        break
      case 'shareToTelegram':
        // This is a placeholder. You'd need to implement the actual Telegram sharing logic
        console.log('Sharing entire chat to Telegram channel')
        toast({
          title: "Sharing to Telegram",
          description: "The chat is being shared to your Telegram channel.",
        })
        break
      default:
        console.log(`Handling ${option}`)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Chat</CardTitle>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <Command>
              <CommandList>
                <CommandGroup>
                  <CommandItem onSelect={() => handleChatOptions('copy')}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Chat
                  </CommandItem>
                  <CommandItem onSelect={() => handleChatOptions('shareToTelegram')}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Share to Telegram
                  </CommandItem>
                  <CommandItem onSelect={() => handleChatOptions('export')}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Chat
                  </CommandItem>
                  <CommandItem onSelect={() => handleChatOptions('clear')}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Chat
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="h-[600px] pr-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'User' ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`flex ${message.sender === 'User' ? 'flex-row-reverse' : 'flex-row'} items-start max-w-[70%]`}>
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarImage src={message.sender === 'User' ? "/user-avatar.png" : "/ai-avatar.png"} />
                  <AvatarFallback>{message.sender === 'User' ? 'U' : 'AI'}</AvatarFallback>
                </Avatar>
                <div className={`mx-2 p-3 rounded-lg ${message.sender === 'User' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                  <p>{message.content}</p>
                  <div className="flex mt-2 gap-1 flex-wrap">
                    {message.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40">
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          <CommandItem onSelect={() => handleEdit(message.id)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </CommandItem>
                          <CommandItem onSelect={() => handleShare(message.id, 'telegram')}>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share to Telegram
                          </CommandItem>
                          <CommandItem onSelect={() => handleShare(message.id, 'slack')}>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share to Slack
                          </CommandItem>
                          <CommandItem onSelect={() => handleSaveToKanban(message.id)}>
                            <Tag className="mr-2 h-4 w-4" />
                            Save to Kanban
                          </CommandItem>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="mt-4">
          <div className="flex items-center mb-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Tag className="h-4 w-4 mr-2" />
                  Tags
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <Command>
                  <CommandList>
                    <CommandGroup heading="Select tags">
                      {['bug', 'feature', 'urgent', 'idea', 'question'].map((tag) => (
                        <CommandItem key={tag} onSelect={() => handleTagSelect(tag)}>
                          <div className={`mr-2 h-4 w-4 rounded-sm border ${selectedTags.includes(tag) ? 'bg-primary' : 'bg-transparent'}`} />
                          {tag}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="flex-grow mx-2">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="mr-1">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => document.getElementById('file-upload')?.click()}>
              <Paperclip className="h-4 w-4" />
            </Button>
            <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} />
          </div>
          <div className="flex items-center">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type @ for people, / for commands, # for tags..."
              className="flex-grow mr-2"
              rows={1}
            />
            <Button variant="outline" size="icon" className={`h-10 w-10 ${isRecording ? 'bg-red-500' : ''}`} onClick={handleVoiceInput}>
              <Mic className="h-4 w-4" />
            </Button>
            <Button className="ml-2" onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}