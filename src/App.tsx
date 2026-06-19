import { type ChangeEvent, type ReactNode, useState } from "react"
import {
  FaCopy,
  FaDownload,
  FaEye,
  FaFileAlt,
  FaMoon,
  FaPen,
  FaPlus,
} from "react-icons/fa"
import "./style.css"
import Logo from "../public/QonText-Logo.png"

type Brief = {
  projectName: string
  assignee: string
  deadline: string
  description: string
  requirements: string
  deliverables: string
  notes: string
}

type FormatOption = {
  name: string
  purpose: string
  markdown: string
}

const defaultBrief: Brief = {
  projectName: "QonText Landing Page",
  assignee: "Frontend Team",
  deadline: "2026-06-30",
  description:
    "Create a clean interface for generating professional README task briefs.",
  requirements:
    "Responsive layout\nMarkdown output\nCopy and download actions\nSimple task form",
  deliverables:
    "Completed React interface\nGenerated README.md file\nBasic styling polish",
  notes: "Keep the interface simple, focused, and easy to scan.",
}

const emptyBrief: Brief = {
  projectName: "",
  assignee: "",
  deadline: "",
  description: "",
  requirements: "",
  deliverables: "",
  notes: "",
}

const readmeFormats: FormatOption[] = [
  {
    name: "Section Heading",
    purpose: "Split the README into clear parts.",
    markdown: `## Installation
Explain how to set up the project.`,
  },
  {
    name: "Bullet List",
    purpose: "Show requirements, features, or steps.",
    markdown: `- Install dependencies
- Run the development server
- Submit the final README`,
  },
  {
    name: "Task Checklist",
    purpose: "Track progress inside the README.",
    markdown: `- [x] Create project layout
- [ ] Add Markdown preview
- [ ] Download README file`,
  },
  {
    name: "Numbered Steps",
    purpose: "Explain a process in order.",
    markdown: `1. Clone the repository
2. Install dependencies
3. Start the app`,
  },
  {
    name: "Code Block",
    purpose: "Show terminal commands or code.",
    markdown: "```bash\nnpm install\nnpm run dev\n```",
  },
  {
    name: "Quote Note",
    purpose: "Call out advice or important context.",
    markdown: `> Keep the README short enough to scan, but complete enough to act on.`,
  },
  {
    name: "Link",
    purpose: "Point users to docs, designs, or repos.",
    markdown: `[Project documentation](https://example.com)`,
  },
  {
    name: "Inline Style",
    purpose: "Highlight labels, commands, or important words.",
    markdown: `Use **bold** for priority, *italic* for notes, and \`npm run dev\` for commands.`,
  },
  {
    name: "Divider",
    purpose: "Separate large README sections.",
    markdown: `---`,
  },
  {
    name: "Table",
    purpose: "Compare roles, dates, or deliverables.",
    markdown: `| Item | Owner | Status |
| --- | --- | --- |
| UI layout | Ama | Done |
| Preview mode | Kojo | In progress |`,
  },
]

const toList = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => `- ${item}`)
    .join("\n")

const cleanList = (value: string) =>
  value
    .split("\n")
    .map((item) => item.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean)
    .join("\n")

const generateMarkdown = (brief: Brief) => {
  const requirements = toList(brief.requirements)
  const deliverables = toList(brief.deliverables)

  return `# ${brief.projectName || "Untitled Project"}

## Assigned To
${brief.assignee || "Unassigned"}

## Deadline
${brief.deadline || "No deadline set"}

## Overview
${brief.description || "Add a short project description."}

## Requirements
${requirements || "- Add project requirements"}

## Deliverables
${deliverables || "- Add expected deliverables"}

## Notes
${brief.notes || "No extra notes."}
`
}

const readSection = (markdown: string, heading: string) => {
  const expression = new RegExp(`## ${heading}\\n([\\s\\S]*?)(?=\\n## |$)`, "i")
  const match = markdown.match(expression)

  return match ? match[1].trim() : ""
}

const parseMarkdown = (markdown: string): Brief => {
  const title = markdown.match(/^#\s+(.+)$/m)
  const deadline = readSection(markdown, "Deadline")

  return {
    projectName: title?.[1]?.trim() || "",
    assignee: readSection(markdown, "Assigned To"),
    deadline: /^\d{4}-\d{2}-\d{2}$/.test(deadline) ? deadline : "",
    description: readSection(markdown, "Overview"),
    requirements: cleanList(readSection(markdown, "Requirements")),
    deliverables: cleanList(readSection(markdown, "Deliverables")),
    notes: readSection(markdown, "Notes"),
  }
}

const renderInline = (text: string) => {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g)

  return parts.map((part, index) => {
    if (/^`[^`]+`$/.test(part)) {
      return <code key={index}>{part.slice(1, -1)}</code>
    }

    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
    }

    if (/^\*[^*]+\*$/.test(part)) {
      return <em key={index}>{part.slice(1, -1)}</em>
    }

    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)

    if (link) {
      return (
        <a key={index} href={link[2]}>
          {link[1]}
        </a>
      )
    }

    return part
  })
}

const renderReadmePreview = (markdown: string) => {
  const lines = markdown.split("\n")
  const blocks: ReactNode[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index].trim()

    if (!line) {
      index += 1
      continue
    }

    if (line.startsWith("# ")) {
      blocks.push(<h1 key={index}>{renderInline(line.replace(/^#\s+/, ""))}</h1>)
      index += 1
      continue
    }

    if (line.startsWith("## ")) {
      blocks.push(<h2 key={index}>{renderInline(line.replace(/^##\s+/, ""))}</h2>)
      index += 1
      continue
    }

    if (line.startsWith("### ")) {
      blocks.push(<h3 key={index}>{renderInline(line.replace(/^###\s+/, ""))}</h3>)
      index += 1
      continue
    }

    if (line === "---" || line === "***") {
      blocks.push(<hr key={index} />)
      index += 1
      continue
    }

    if (line.startsWith("```")) {
      const code: string[] = []
      const codeStart = index
      index += 1

      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        code.push(lines[index])
        index += 1
      }

      index += 1
      blocks.push(
        <pre key={codeStart}>
          <code>{code.join("\n")}</code>
        </pre>,
      )
      continue
    }

    if (line.startsWith("> ")) {
      blocks.push(
        <blockquote key={index}>{renderInline(line.replace(/^>\s+/, ""))}</blockquote>,
      )
      index += 1
      continue
    }

    if (
      line.startsWith("|") &&
      lines[index + 1]?.trim().startsWith("|") &&
      lines[index + 1].includes("---")
    ) {
      const headers = line
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean)
      const rows: string[][] = []
      const tableStart = index
      index += 2

      while (index < lines.length && lines[index].trim().startsWith("|")) {
        rows.push(
          lines[index]
            .split("|")
            .map((item) => item.trim())
            .filter(Boolean),
        )
        index += 1
      }

      blocks.push(
        <table key={tableStart}>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`${tableStart}-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`${tableStart}-${rowIndex}-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>,
      )
      continue
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = []
      const listStart = index

      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ""))
        index += 1
      }

      blocks.push(
        <ul key={listStart}>
          {items.map((item, itemIndex) => (
            <li key={`${listStart}-${itemIndex}`}>
              {item.startsWith("[x] ") || item.startsWith("[ ] ") ? (
                <>
                  <input
                    type="checkbox"
                    checked={item.startsWith("[x] ")}
                    readOnly
                  />
                  <span>{renderInline(item.replace(/^\[[x ]\]\s+/, ""))}</span>
                </>
              ) : (
                renderInline(item)
              )}
            </li>
          ))}
        </ul>,
      )
      continue
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = []
      const listStart = index

      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""))
        index += 1
      }

      blocks.push(
        <ol key={listStart}>
          {items.map((item, itemIndex) => (
            <li key={`${listStart}-${itemIndex}`}>{renderInline(item)}</li>
          ))}
        </ol>,
      )
      continue
    }

    const paragraph: string[] = []
    const paragraphStart = index

    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].trim().startsWith("#") &&
      !/^[-*]\s+/.test(lines[index].trim()) &&
      !/^\d+\.\s+/.test(lines[index].trim())
    ) {
      paragraph.push(lines[index].trim())
      index += 1
    }

    blocks.push(<p key={paragraphStart}>{renderInline(paragraph.join(" "))}</p>)
  }

  return blocks
}

export default function App() {
  const [brief, setBrief] = useState(defaultBrief)
  const [markdown, setMarkdown] = useState(generateMarkdown(defaultBrief))
  const [copied, setCopied] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const updateBrief = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const nextBrief = {
      ...brief,
      [event.target.name]: event.target.value,
    }

    setBrief(nextBrief)
    setMarkdown(generateMarkdown(nextBrief))
  }

  const updatePaper = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const nextMarkdown = event.target.value

    setMarkdown(nextMarkdown)
    setBrief(parseMarkdown(nextMarkdown))
  }

  const startNewBrief = () => {
    setBrief(emptyBrief)
    setMarkdown(generateMarkdown(emptyBrief))
  }

  const addFormatToPaper = (format: string) => {
    const nextMarkdown = `${markdown.trimEnd()}\n\n${format}\n`

    setMarkdown(nextMarkdown)
    setBrief(parseMarkdown(nextMarkdown))
    setPreviewMode(false)
  }

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = `${brief.projectName || "qontext-brief"}.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="wrapper">
      <div className="header">
        <div className="logo">
          <img src={Logo} height={50} alt="QonText logo" />
          <h1> <span style={{ color: '#434685ff'  }}>Q</span>onText</h1>
        </div>
        <button className="theme" type="button" aria-label="Toggle theme">
          <FaMoon />
        </button>
      </div>

      <div className="holder">
        <div className="tools">
          <div className="toolTitle">
            <FaFileAlt />
            <span>README Brief Builder</span>
          </div>
          <div className="toolButtons">
            <button type="button" onClick={copyMarkdown}>
              <FaCopy />
              {copied ? "Copied" : "Copy"}
            </button>
            <button type="button" onClick={downloadMarkdown}>
              <FaDownload />
              Download
            </button>
          </div>
        </div>
      </div>

      <div className="workingArea">
        <div className="plugins inputPanel">
          <h2>Document Details</h2>

          <label>
            Title
            <input
              name="projectName"
              value={brief.projectName}
              onChange={updateBrief}
              placeholder="Assignment, task, event, or brief title"
            />
          </label>

          <label>
            For
            <input
              name="assignee"
              value={brief.assignee}
              onChange={updateBrief}
              placeholder="Person, team, class, or group"
            />
          </label>

          <label>
            Due date
            <input
              name="deadline"
              type="date"
              value={brief.deadline}
              onChange={updateBrief}
            />
          </label>

          <label>
            Summary
            <textarea
              name="description"
              value={brief.description}
              onChange={updateBrief}
              rows={4}
              placeholder="What is this document about?"
            />
          </label>

          <h2 className="sectionTitle">Details</h2>
          <label>
            Instructions
            <textarea
              name="requirements"
              value={brief.requirements}
              onChange={updateBrief}
              rows={6}
              placeholder="One instruction per line"
            />
          </label>

          <label>
            Expected outcomes
            <textarea
              name="deliverables"
              value={brief.deliverables}
              onChange={updateBrief}
              rows={5}
              placeholder="One outcome per line"
            />
          </label>

          <label>
            Notes
            <textarea
              name="notes"
              value={brief.notes}
              onChange={updateBrief}
              rows={3}
              placeholder="Extra context"
            />
          </label>

          <button
            className="newBrief"
            type="button"
            onClick={startNewBrief}
          >
            <FaPlus />
            New brief
          </button>
        </div>

        <div className="paper">
          <div className="paperHeader">
            <span>README.md</span>
            <button
              className="previewButton"
              type="button"
              onClick={() => setPreviewMode((currentMode) => !currentMode)}
            >
              {previewMode ? <FaPen /> : <FaEye />}
              {previewMode ? "Edit paper" : "Preview README"}
            </button>
          </div>
          {previewMode ? (
            <div className="readmePreview">{renderReadmePreview(markdown)}</div>
          ) : (
            <textarea
              className="paperEditor"
              value={markdown}
              onChange={updatePaper}
              spellCheck="true"
            />
          )}
        </div>

        <div className="plugins sidePanel">
          <h2>README Formats</h2>

          <div className="formatList">
            {readmeFormats.map((format) => (
              <button
                className="formatCard"
                type="button"
                key={format.name}
                onClick={() => addFormatToPaper(format.markdown)}
              >
                <span className="formatName">{format.name}</span>
                <span className="formatPurpose">{format.purpose}</span>
                <code>{format.markdown}</code>
                <div className="formatPreview">
                  {renderReadmePreview(format.markdown)}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
