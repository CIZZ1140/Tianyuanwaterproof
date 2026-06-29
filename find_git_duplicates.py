import subprocess

def find_duplicates():
    result = subprocess.check_output(['git', 'ls-files'], text=True)
    files = result.splitlines()
    lowered = {}
    for f in files:
        low = f.lower()
        if lowered.get(low):
            print(f"DUPLICATE DETECTED: {lowered[low]} AND {f}")
        lowered[low] = f

if __name__ == "__main__":
    find_duplicates()
