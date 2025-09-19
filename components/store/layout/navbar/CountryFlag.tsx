import {cva, type VariantProps} from "class-variance-authority"
import {cn} from "@/lib/utils"

const flagVariants = cva(
    "inline-flex items-center gap-2",
    {
        variants: {
            size: {
                sm: "text-xs [&_.flag-icon]:size-4",
                md: "text-sm [&_.flag-icon]:size-5",
                lg: "text-base [&_.flag-icon]:size-7",
            },
            withLabel: {
                true: "flex-row",
                false: "flex",
            },
        },
        defaultVariants: {
            size: "md",
            withLabel: true,
        },
    }
)

interface CountryFlagProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof flagVariants> {
    countryCode: string
    countryName: string
}

function CountryFlag({
                         countryCode,
                         countryName,
                         size,
                         withLabel,
                         className,
                         ...props
                     }: CountryFlagProps) {
    return (
        <div
            className={cn(flagVariants({size, withLabel, className}))}
            {...props}
        >
      <span
          className={cn(
              `fi fi-${countryCode.toLowerCase()} rounded shadow-sm`,
              "flag-icon"
          )}
          title={countryName}
      />
            {withLabel && <span>{countryName}</span>}
        </div>
    )
}

export {CountryFlag, flagVariants}
