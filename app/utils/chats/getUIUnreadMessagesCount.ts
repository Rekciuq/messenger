export const getUIUnreadMessagesCount = (unreadMessagesCount: number) => {
    const maxUIUnreadCount = 9;
    return unreadMessagesCount > 9 ? `${maxUIUnreadCount}+` : unreadMessagesCount;
 }