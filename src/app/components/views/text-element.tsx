import styles from "@/styles/components/elements/text-element.module.sass";
import { hexToRGBA } from "@/utils/hexToRgba";

interface TextElementProps {
  text: string;
  mainColor: string;
  textColor: string;
}

export function TextElement({ text, mainColor, textColor }: TextElementProps) {
  return (
    <div
      id={styles.textContainer}
      style={{
        border: `2px solid ${mainColor}`,
        backgroundColor: hexToRGBA(mainColor, "0.25"),
      }}
    >
      <h2 style={{ color: textColor }}>{text}</h2>
    </div>
  );
}
