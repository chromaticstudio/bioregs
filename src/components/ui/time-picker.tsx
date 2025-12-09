import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type TimePickerProps = {
  value?: string // HH:MM format (24-hour)
  onTimeChange?: (time: string) => void
}

export function TimePicker({ value, onTimeChange }: TimePickerProps) {
  // Parse the 24-hour time into components
  const parseTime = (time24?: string) => {
    if (!time24) {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const period = hours >= 12 ? 'PM' : 'AM'
      const hour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
      
      // Round DOWN to nearest 30 minutes
      const minute = minutes >= 30 ? 30 : 0
      
      return { hour, minute, period }
    }
    
    const [hours, minutes] = time24.split(':').map(Number)
    const period = hours >= 12 ? 'PM' : 'AM'
    const hour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
    
    // Round DOWN to nearest 30 minutes
    const minute = minutes >= 30 ? 30 : 0
    
    return { hour, minute, period }
  }

  const [selectedTime, setSelectedTime] = useState(() => parseTime(value))

  // Update when value prop changes
  useEffect(() => {
    if (value) {
      setSelectedTime(parseTime(value))
    }
  }, [value])

  // Generate all 30-minute intervals (24 total: 1:00, 1:30, 2:00, ..., 12:00, 12:30)
  const timeSlots = []
  for (let hour = 1; hour <= 12; hour++) {
    timeSlots.push({ hour, minute: 0 })
    timeSlots.push({ hour, minute: 30 })
  }

  const periods = ['AM', 'PM']

  const updateTime = (hour: number, minute: number, period?: string) => {
    const newTime = { 
      hour, 
      minute, 
      period: period || selectedTime.period 
    }
    setSelectedTime(newTime)
    
    // Convert to 24-hour format
    let hour24 = newTime.hour
    if (newTime.period === 'PM' && hour24 !== 12) hour24 += 12
    if (newTime.period === 'AM' && hour24 === 12) hour24 = 0
    
    const time24 = `${hour24.toString().padStart(2, '0')}:${newTime.minute.toString().padStart(2, '0')}`
    onTimeChange?.(time24)
  }

  return (
    <div className="flex gap-2">
      {/* Time Dropdown (Hour:Minute combined) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-28 justify-between font-normal"
          >
            {`${selectedTime.hour}:${selectedTime.minute.toString().padStart(2, '0')}`}
            <ChevronDownIcon className="opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-[300px] overflow-y-auto" align="start">
          {timeSlots.map(({ hour, minute }) => (
            <DropdownMenuItem
              key={`${hour}:${minute}`}
              onClick={() => updateTime(hour, minute)}
              className={cn(
                selectedTime.hour === hour && selectedTime.minute === minute && "bg-accent"
              )}
            >
              {`${hour}:${minute.toString().padStart(2, '0')}`}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* AM/PM Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-20 justify-between font-normal"
          >
            {selectedTime.period}
            <ChevronDownIcon className="opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {periods.map((period) => (
            <DropdownMenuItem
              key={period}
              onClick={() => updateTime(selectedTime.hour, selectedTime.minute, period)}
              className={cn(
                selectedTime.period === period && "bg-accent"
              )}
            >
              {period}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}