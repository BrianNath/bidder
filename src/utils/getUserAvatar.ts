export default function getUserAvatar(userName: string) {
  const initials = userName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
  return initials;
}
