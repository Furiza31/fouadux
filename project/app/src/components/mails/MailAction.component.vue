<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Mail } from "@/types/mail";
import { Ellipsis, Eye, Trash } from "lucide-vue-next";
import { useRouter } from "vue-router";

const props = defineProps<{
  mail: Mail;
}>();

const emits = defineEmits(["on-delete"]);

const router = useRouter();

const onView = () => {
  router.push({
    name: "Mail",
    params: { id: props.mail.id },
  });
};

const onDelete = () => {
  emits("on-delete", props.mail.id);
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger class="cursor-pointer">
      <Ellipsis class="size-6" />
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="cursor-pointer" @click="onView">
        <Eye class="size-4 mr-1" />
        <span>View</span>
      </DropdownMenuItem>
      <DropdownMenuItem class="cursor-pointer" @click="onDelete">
        <Trash class="size-4 mr-1" />
        <span>Delete</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
