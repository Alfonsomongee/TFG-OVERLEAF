import re
import json

log_path = 'C:/Users/aphmo/.gemini/antigravity/brain/74b24cee-4df9-4153-bf3c-0850e5106001/.system_generated/logs/transcript.jsonl'
with open(log_path, 'r', encoding='utf-8') as f:
    text = f.read()

# The tool call is JSON but might be truncated. We look for 'TargetFile' and 'CodeContent'
# in the raw string.
matches = re.findall(r'"TargetFile":\s*"([^"]+anexo-[^"]+\.mdx)".*?"CodeContent":\s*"(.*?)"', text, flags=re.DOTALL)
print(f"Found {len(matches)} matches")

if matches:
    print(matches[-1][0])
    print(matches[-1][1][:100])
    
    # Let's save the last version of each file we find!
    files_saved = set()
    for match in reversed(matches):
        target = match[0]
        content = match[1]
        if target not in files_saved:
            # CodeContent is JSON-escaped string, we need to unescape it!
            # Since it might be truncated, we add a closing quote if needed.
            try:
                # Add closing quote if it's missing to make it a valid json string
                if not content.endswith('"'):
                     content_to_parse = '"' + content + '"'
                else:
                     content_to_parse = '"' + content
                
                # Wait, the regex captures the content WITHOUT the quotes because of "(.*?)"
                # But it stops at the NEXT quote. Wait, if there are escaped quotes inside, (.*?) might stop too early!
                pass
            except Exception as e:
                pass
