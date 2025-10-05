import { type TreeItem } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert a flat file collection into a tree structure suitable for a tree view component.
 * @param files An object where keys are file paths and values are file contents.
 * @returns An array of tree items representing the file structure.
 * 
 * @example
 * Input: { "src/index.ts": "console.log('Hello, world!');", "README.md": "..." }
 * Output: [["src", "index.ts"], "README.md"]
 */
export function convertFilesToTreeItems (
  files: { [path: string]: string },
) : TreeItem[] {
  interface TreeNode {
    [key: string]: TreeNode | null;
  }

  const tree: TreeNode = {};

  const sortedPaths = Object.keys(files).sort();

  for (const filePath of sortedPaths) {
    const parts = filePath.split('/');
    let currentNode = tree;

    for (let i = 0; i < parts.length - 1; i++) {
      const pathPart = parts[i];
      if (!currentNode[pathPart]) {
        currentNode[pathPart] = i === parts.length - 1 ? null : {};
      }
      currentNode = currentNode[pathPart] as TreeNode;
    }

    const fileName = parts[parts.length - 1];
    currentNode[fileName] = null;
  }

  function convertNode(node: TreeNode, name?: string): TreeItem[] | TreeItem {
    const entries = Object.entries(node);

    if( entries.length === 0 && name) {
      return name || "";
    }

    const children: TreeItem[] = [];

    for (const [key, value] of entries) {
      if (value === null) {
        // It's a file
        children.push(key);
      } else {
        // It's a directory
        const dirChildren = convertNode(value, key);
        if (Array.isArray(dirChildren)) {
          children.push([key, ...dirChildren]);
        } else {
          children.push([key, dirChildren]);
        }
      }
    }

    return children;
  }

  const result = convertNode(tree);

  return Array.isArray(result) ? result : [result];
};