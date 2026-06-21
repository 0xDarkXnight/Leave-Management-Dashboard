import {
  ApplyIcon, CheckIcon, XIcon, ChatIcon, EditIcon,
  TrashIcon, LoginIcon, LogoutIcon, BellFilledIcon,
} from "../components/Icons";

export const TYPE_META = {
  leave_submitted: {
    Icon:   ApplyIcon,
    accent: "accent-info",
    label:  "Leave Request",
  },
  leave_pending_review: {
    Icon:   ApplyIcon,
    accent: "accent-warning",
    label:  "Needs Review",
  },
  leave_approved: {
    Icon:   CheckIcon,
    accent: "accent-success",
    label:  "Approved",
  },
  leave_rejected: {
    Icon:   XIcon,
    accent: "accent-danger",
    label:  "Rejected",
  },
  leave_updated: {
    Icon:   EditIcon,
    accent: "accent-info",
    label:  "Updated",
  },
  leave_deleted: {
    Icon:   TrashIcon,
    accent: "accent-danger",
    label:  "Cancelled",
  },
  message_received: {
    Icon:   ChatIcon,
    accent: "accent-info",
    label:  "Message",
  },
  message_sent: {
    Icon:   ChatIcon,
    accent: "accent-info",
    label:  "Message",
  },
  user_login: {
    Icon:   LoginIcon,
    accent: "accent-neutral",
    label:  "Sign In",
  },
  user_logout: {
    Icon:   LogoutIcon,
    accent: "accent-neutral",
    label:  "Sign Out",
  },
};

export const DEFAULT_META = {
  Icon:   BellFilledIcon,
  accent: "accent-neutral",
  label:  "Update",
};

export const getTypeMeta = (type) => TYPE_META[type] ?? DEFAULT_META;

export const getNotificationRoute = (type) => {
  switch (type) {
    case "message_received":
      return "/chat";
    case "leave_pending_review":
      return "/manager";
    case "leave_submitted":
    case "leave_approved":
    case "leave_rejected":
    case "leave_updated":
    case "leave_deleted":
      return "/history";
    default:
      return null;
  }
};
