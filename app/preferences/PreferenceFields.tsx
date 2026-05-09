import {EVENT_TYPES} from './constants'

export default function PreferenceFields({
  preferences = {},
}: {
  preferences?: {eventTypes?: string[]; adaAccessible?: boolean}
}) {
  const {eventTypes = [], adaAccessible = false} = preferences

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h2 className="font-semibold">What types of events would you like to attend?</h2>
        <div className="flex flex-col gap-2">
          {EVENT_TYPES.map((type) => (
            <label key={type} className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="eventTypes"
                value={type}
                defaultChecked={eventTypes.includes(type)}
                className="checkbox checkbox-primary"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">Accessibility</h2>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            name="adaAccessible"
            defaultChecked={adaAccessible}
            className="checkbox checkbox-primary"
          />
          <span>Do you or your typical guest require ADA-accessible seating?</span>
        </label>
      </div>
    </div>
  )
}
