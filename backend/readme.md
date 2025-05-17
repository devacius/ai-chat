Steps to run backend - 
1. Create venv and activate that using 

```python3 -m venv venv
source venv/bin/activate
```
2. Install dependencies from requirement.txt using 
pip install -r requirements.txt

3. Start local server using 
uvicorn main:app --reload
