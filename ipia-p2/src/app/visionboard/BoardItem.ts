interface BoardItem {
  id: number;
  type: 'note' | 'image' | 'quote';
  content: string;
  left: number;
  top: number;
  color?: string;
}
